import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerModule } from "@nestjs/swagger/dist";
import { AppModule } from "./app.module";
import * as bodyParser from 'body-parser';

async function start(){
    const PORT = process.env.PORT || 5000;

    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Маркетплейс')
        .setDescription('Документация по маркетплейсу')
        .setVersion('1.0.0')
        .addTag("Marketplace")
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()