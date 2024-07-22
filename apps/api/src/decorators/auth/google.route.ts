import { SetMetadata } from '@nestjs/common';

export const IS_GOOGLE_ROUTE = 'google_route';
export const GoogleRoute = () => SetMetadata(IS_GOOGLE_ROUTE, true);
