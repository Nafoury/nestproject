import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let app: NestExpressApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalInterceptors(new BigIntInterceptor());

    app.enableCors({
      origin: process.env.FRONTEND_URL || true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    });

    if (process.env.NODE_ENV !== 'production') {
      app.useStaticAssets(join(process.cwd(), "uploads"), {
        prefix: "/uploads",
      });
    }

    // عدم استدعاء listen في بيئة Vercel
    if (!process.env.VERCEL) {
      await app.listen(process.env.PORT ?? 3000);
    } else {
      await app.init();
    }
  }

  return app;
}

// تشغيل التطبيق محلياً عند عدم التواجد على Vercel
if (!process.env.VERCEL) {
  bootstrap();
}

export default async (req: any, res: any) => {
  const instance = await bootstrap();
  const expressInstance = instance.getHttpAdapter().getInstance();
  return expressInstance(req, res);
};