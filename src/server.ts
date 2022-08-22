import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import BadgesRoute from '@routes/badges/badges.route';

validateEnv();

const app = new App([new IndexRoute(), new BadgesRoute()]);

app.listen();
