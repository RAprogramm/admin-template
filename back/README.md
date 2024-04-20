# Rust Admin Backend

- Rust
- PostgreSQL
- SwagerUI

## Project commands

> Make sure that you are in `back` directory

<table>
    <th>Action</th>
    <th>Command in terminal</th>
    <tr>
        <td>Run server with prod data</td>
        <td><code>make start</code></td>
    </tr>
    <tr>
        <td>Run server with dev data and hot reload</td>
        <td><code>make dev</code></td>
    </tr>
    <tr>
        <td>Install sqlx</td>
        <td><code>make install_sqlx</code></td>
    </tr>
    <tr>
        <td>Database migration</td>
        <td><code>make db_migrate</code></td>
    </tr>
    <tr>
        <td>Revert database migration (clear)</td>
        <td><code>make db_revert</code></td>
    </tr>
    <tr>
        <td>Prepare sqlx requests</td>
        <td><code>make run_prepared_sqlx</code></td>
    </tr>
</table>

## SwagerUI

After server was started you can go to [swager](http://localhost:8000/).
