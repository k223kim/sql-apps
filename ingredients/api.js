const path = require("path");
const express = require("express");
const router = express.Router();
const pg = require("pg");

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 5432,
});

router.get("/type", async (req, res) => {
    const { type } = req.query;
    //console.log("get ingredients", type);
    const { rows } = await pool.query(`select * from ingredients where type=$1`, [type]);
    //console.log(rows);

    // return all ingredients of a type

    res.status(200).json({ status: "implemented", rows: rows });
});

router.get("/search", async (req, res) => {
    let { term, page } = req.query;
    page = page ? page : 0;
    console.log("search ingredients", term, page);
    const { rows } = await pool.query(`
        select *,
        count(*) over ()::int as total_count
        from ingredients where title ilike $2 limit 5 offset $1;`, [page*5, `%${term}%`]);


    //const { rows } = await pool.query(`
    //    select *, count(*) over()::INT
    //    as total_count from ingredients where title like $1 limit 5 offset $2;`
    //    , [`'%${term}%'`,page] );

    // return all columns as well as the count of all rows as total_count
    // make sure to account for pagination and only return 5 rows at a time

    res.status(200).json({ status: "implemented", rows: rows });
});

/**
 * Student code ends here
 */

module.exports = router;
