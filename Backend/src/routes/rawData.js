
module.exports = (app, conn) => {
   
    /**
     * Fetch all data from a specified table
     */
    app.get('/api/fetch_table', (req, res, next) => {

        const tableName = req.query.tableName;
        
        const sql = `SELECT * FROM ${tableName} ORDER BY 1 ASC;`;
        console.log(sql);
        conn.query(sql, (err, results) => {
            if (err) {
                next(err);
                return;
            }
            res.send(results);
        });
    });
}