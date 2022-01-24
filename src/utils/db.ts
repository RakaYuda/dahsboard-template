import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(String(process.env.MYSQL_PORT)),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

type QueryAttribute = {
  query: string;
  values: any[] | undefined;
};

const executeQuery = async ({ query, values }: QueryAttribute) => {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};

export default executeQuery;
