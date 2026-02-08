import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  Inject,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { WebhookConnector } from '../connectors';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @Inject('SOURCE_REPOSITORY')
    private sourcesRepository: Repository<DataSourceEntity>,
  ) {}

  /**
   * Receive webhook events for a specific source
   */
  @Post(':sourceId')
  @HttpCode(200)
  async receiveWebhook(
    @Param('sourceId') sourceId: string,
    @Body() payload: any,
    @Headers('x-webhook-secret') secret?: string,
    @Headers('x-webhook-signature') signature?: string,
  ): Promise<{ received: boolean; eventId: string }> {
    // Find the source
    const source = await this.sourcesRepository.findOneBy({ id: sourceId });

    if (!source) {
      throw new NotFoundException(`Source ${sourceId} not found`);
    }

    if (source.type !== 'webhook') {
      throw new NotFoundException(`Source ${sourceId} is not a webhook source`);
    }

    // Validate webhook secret if configured
    const configuredSecret = source.connectionConfig?.secret;
    if (configuredSecret) {
      if (signature) {
        // Validate HMAC signature
        const expectedSignature = this.computeSignature(
          JSON.stringify(payload),
          configuredSecret
        );
        if (!this.secureCompare(signature, expectedSignature)) {
          throw new UnauthorizedException('Invalid webhook signature');
        }
      } else if (secret) {
        // Simple secret comparison
        if (secret !== configuredSecret) {
          throw new UnauthorizedException('Invalid webhook secret');
        }
      } else {
        throw new UnauthorizedException('Webhook secret required');
      }
    }

    // Generate event ID
    const eventId = crypto.randomUUID();

    // Store the event
    WebhookConnector.storeEvent(sourceId, {
      ...payload,
      _eventId: eventId,
    });

    // Update source lastSyncAt
    source.lastSyncAt = new Date().toISOString();
    source.status = 'connected';

    // Update record count
    const eventCount = WebhookConnector.getEventCount(sourceId);
    source.connectionConfig = {
      ...source.connectionConfig,
      recordsIngested: String(eventCount),
    };

    await this.sourcesRepository.save(source);

    this.logger.log(`Received webhook event for source ${sourceId}: ${eventId}`);

    return {
      received: true,
      eventId,
    };
  }

  /**
   * Compute HMAC-SHA256 signature
   */
  private computeSignature(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }
}
