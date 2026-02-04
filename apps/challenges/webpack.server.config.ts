import { withModuleFederationForSSR } from '@nx/module-federation/angular';
import config from './module-federation.config';

export default withModuleFederationForSSR(config, { dts: false });
