import { Component } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import { Connection, createConnection } from 'typeorm';
import { User } from './models/user.entity';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  typeOrmConnection: Connection;

  constructor(
    private platform: Platform,
  ) {
    this.platform.ready().then(() => this.setupDb());
  }

  async setupDb() {
    // when using Capacitor, you might want to close existing connections,
    // otherwise new connections will fail when using dev-live-reload
    // see https://github.com/capacitor-community/sqlite/issues/106
    const pSqliteConsistent = CapacitorSQLite.checkConnectionsConsistency({
      dbNames: [], // i.e. "i expect no connections to be open"
    }).catch((e) => {
      // the plugin throws an error when closing connections. we can ignore
      // that since it is expected behaviour
      console.log(e);
      return {};
    });

    // create a SQLite Connection Wrapper
    const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

    // copy preloaded dbs (optional, not TypeORM related):
    // the preloaded dbs must have the `YOUR_DB_NAME.db` format (i.e. including
    // the `.db` suffix, NOT including the internal `SQLITE` suffix from the plugin)
    await sqliteConnection.copyFromAssets();

    // create the TypeORM connection
    this.typeOrmConnection = await createConnection({
      type: 'capacitor',
      driver: sqliteConnection, // pass the connection wrapper here
      database: 'testDB', // database name without the `.db` suffix
      entities: [User],
      synchronize: true
    });

    this.testInsert();
  }

  async testInsert() {
    const a = new User();
    a.name = 'test';
    await this.typeOrmConnection.manager.save(a);
  }
}
