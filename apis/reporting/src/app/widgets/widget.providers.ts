import { Widget } from '../database/entities/widget.entity';
import { DataSource } from 'typeorm';

export const widgetProviders = [
  {
    provide: 'WIDGET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Widget),
    inject: ['DATABASE_CONNECTION'],
  },
];
