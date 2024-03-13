import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Feature } from './entities/feature.entity';

let mockFeatures = [
  {
    id: '1',
    title: 'Mock Feature 01',
    description: 'Feature description',
    slug: 'mock',
    remote_uri: 'NA',
    api_uri: 'NA',
    healthy: false,
  },
  {
    id: '2',
    title: 'Mock Feature 02',
    description: 'Feature description',
    slug: 'mock',
    remote_uri: 'NA',
    api_uri: 'NA',
    healthy: false,
  },
  {
    id: '3',
    title: 'Mock Feature 03',
    description: 'Feature description',
    slug: 'mock',
    remote_uri: 'NA',
    api_uri: 'NA',
    healthy: false,
  },
];

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
}

@Injectable()
export class FeaturesService {
  create(feature) {
    feature = Object.assign({}, feature, { id: uuidv4()});
    mockFeatures = [...mockFeatures, feature];
    return mockFeatures;
  }

  findAll() {
    return mockFeatures;
  }

  findOne(id) {
    return mockFeatures.find((feature) => feature.id == id);
  }

  update(id, feature) {
    mockFeatures = mockFeatures.map((f) => {
      return f.id == id ? Object.assign({}, feature) : f;
    });
  }

  remove(id) {
    mockFeatures = mockFeatures.filter((feature) => feature.id == id);
    return mockFeatures;
  }
}
