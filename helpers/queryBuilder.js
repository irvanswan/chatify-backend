const queryBuilder = {
    select : (nmTable,req) =>{
        return `SELECT * FROM ${nmTable}`
    },
    selectWhere: (nmTable, req)=>{
        return `SELECT * FROM ${nmTable} WHERE ${Object.keys(req)} = '${Object.values(req)}'`
    },
    deleted: (nmTable,where)=>{
        if(where != null || where != ''){
            return `DELETE FROM ${nmTable} WHERE ${Object.keys(where)} = '${Object.values(where)}'`
        }else{
            return `DELETE FROM ${nmTable}`
        }
    },
    leftJoinTable : (table,targetTable, column1, column2, where)=>{
        return `LEFT JOIN ${targetTable} ON ${table}.${column1} = ${targetTable}.${column2} WHERE
        ${table}.${Object.keys(where)} LIKE '% ${Object.values(where)} %'`
    },
    andWhereJoin : (table,where)=>{
        return `AND ${table}.${Object.keys(where)} = ${Object.values(where)}`
    },
     // extra
    selectLike : (where)=>{
        return `WHERE ${Object.keys(where)} LIKE '%${Object.values(where)}%'`
    },
    limitOffset : (limit, offset)=>{
        return `LIMIT ${limit} OFFSET ${offset}`
    },
    orWhere : (req)=>{
        return `OR ${Object.keys(req).toString()} = '${Object.values(req)}'`
    },
    groupBy : (columnName)=>{
        return `GROUP BY ${columnName}`;
    },
    orderBy : (columnName)=>{
        return `ORDER BY ${columnName}`;
    }
}

module.exports = queryBuilder