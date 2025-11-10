import express from 'express';
import cors from 'cors'
import routesRouter from './adapters/inbound/http/routesController';
import complianceRouter from './adapters/inbound/http/complianceController';
import bankingRouter from './adapters/inbound/http/bankingController';
import poolsRouter from './adapters/inbound/http/poolsController';

export const app = express();
app.use(cors())
app.use(express.json());

// routes
app.use('/routes', routesRouter);
app.use('/compliance', complianceRouter);
app.use('/banking', bankingRouter);
app.use('/pools', poolsRouter);

// health
app.get('/health', (req, res) => res.json({ ok: true }));
