import * as sql from 'mssql';
import * as express from 'express';

class Database {
  private connection = new sql.ConnectionPool({
    database: 'Alterdata',
    server: 'localhost',
    user: 'sa',
    password: '123456'
  });

  protected async conectar() {
    try {
      if (!this.connection.connected) {
        await this.connection.connect();
      }
    } catch (error) {
      if (error.code !== 'EALREADYCONNECTED') {
        throw error;
      }
    }
    return this.connection;
  }
}

class Provider extends Database {
  public async obterPessoas() {
    let connection = await this.conectar();
    let request = connection.request();
    let response = await request.query('select top 10 * from pessoa');
    return response.recordset;
  }
}

let app = express();
app.get('/', async (request, response) => {
  let provider = new Provider();
  try {
    let pessoas = await provider.obterPessoas();
    response.status(200).json(pessoas);
  } catch (error) {
    response.status(500).json(error);
  }
});

app.listen(3000);
