import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true,
    envFilePath : './src/config/.env'
  }),TypeOrmModule.forRootAsync({
    useFactory : () => ({
      "name"     : "default",
      "type"     : "mysql",
      "host"     : process.env.DB_HOST,
      "port"     : Number(process.env.DB_PORT),
      "username" : process.env.DB_USER,
      "password" : "cc",
      "database" : "CC",
      "synchronize": false,
      "entities": [__dirname + '/entities/*.{js,ts}'],
    })
}), FeedModule, AuthModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
