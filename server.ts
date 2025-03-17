import { serve } from 'bun';
import { Database } from 'bun:sqlite';

import Index from './src/index.html' with { type: 'text/html' };

const db = new Database('invoices.sqlite', { create: true });

serve({
  routes: {
    '/': Index,
    '/api/invoices': {
      GET: async () => {
        const tableExists = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='invoices'").get();

        if (!tableExists) {
          db.query(`
            CREATE TABLE invoices (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              date_created TEXT NOT NULL DEFAULT (datetime('now')),
              date_updated TEXT NOT NULL DEFAULT (datetime('now')),
              status TEXT NOT NULL DEFAULT 'draft'
            )
          `).run();
        }

        return Response.json(db.query('SELECT id, status FROM invoices').all()); // LIMIT 100
      },

      POST: async (req: Request) => {
        const data = await req.json();

        if (!data.status) {
          return new Response('Status is required', { status: 400 });
        }

        const validStatuses = ['draft', 'sent', 'paid', 'unpaid'];

        if (!validStatuses.includes(data.status)) {
          return Response.json({ message: `Status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }

        db.query(`
          INSERT INTO invoices (status)
          VALUES (?)
        `).run(data.status || 'draft');

        const newInvoice = db.query('SELECT * FROM invoices WHERE id = last_insert_rowid()').get();
        return Response.json(newInvoice);
      },
    },
    '/api/invoices/:id': {
      GET: async (req: Request) => {
        const { id } = req.params;
        const invoice = db.query('SELECT * FROM invoices WHERE id = $id').get({ $id: id });

        if (!invoice) {
          return Response.json({ message: 'Invoice not found' }, { status: 404 });
        }

        return Response.json(invoice);
      },
      PUT: async (req: Request) => {
        const { id } = req.params;
        const data = await req.json();

        if (!data.status) {
          return new Response('Status is required', { status: 400 });
        }

        const validStatuses = ['draft', 'sent', 'paid', 'unpaid'];

        if (!validStatuses.includes(data.status)) {
          return Response.json({ message: `Status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }

        db.query(`
          UPDATE invoices
          SET status = ?, date_updated = datetime('now')
          WHERE id = ?
        `).run(data.status, id);

        const updatedInvoice = db.query('SELECT * FROM invoices WHERE id = $id').get({ $id: id });
        return Response.json(updatedInvoice);
      },
    },
    '/api/lineitems/:id': {
      GET: async () => {
        const { id } = req.params;
        const tableExists = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='lineitems'").get();

        if (!tableExists) {
          db.query(`
            CREATE TABLE lineitems (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              invoice_id INTEGER NOT NULL,
              description TEXT NOT NULL,
              quantity REAL NOT NULL,
              price INTEGER NOT NULL,
              FOREIGN KEY (invoice_id) REFERENCES invoices(id)
            )
          `).run();
        }

        const lineItems = db.query('SELECT * FROM lineitems WHERE invoice_id = $id').all({ $id: id });

        if (!lineItems) {
          return Response.json({ message: 'Line items not found' }, { status: 404 });
        }

        return Response.json(lineItems);
      },
      POST: async (req: Request) => {
        const { id } = req.params;
        const data = await req.json();

        if (!data.description || !data.quantity || !data.price) {
          return new Response('Description, quantity, and price are required', { status: 400 });
        }

        db.query(`
          INSERT INTO lineitems (invoice_id, description, quantity, price)
          VALUES (?, ?, ?, ?)
        `).run(id, data.description, data.quantity, data.price);

        const newLineItem = db.query('SELECT * FROM lineitems WHERE id = last_insert_rowid()').get();
        return Response.json(newLineItem);
      },
      PUT: async (req: Request) => {
        const { id } = req.params;
        const data = await req.json();

        if (!data.description || !data.quantity || !data.price) {
          return new Response('Description, quantity, and price are required', { status: 400 });
        }

        db.query(`
          UPDATE lineitems
          SET description = ?, quantity = ?, price = ?
          WHERE id = ?
        `).run(data.description, data.quantity, data.price, id);

        const updatedLineItem = db.query('SELECT * FROM lineitems WHERE id = $id').get({ $id: id });
        return Response.json(updatedLineItem);
      }
    },
  },

  fetch(request) {
    return new Response('404 Not Found', { status: 404 });
  },
});
