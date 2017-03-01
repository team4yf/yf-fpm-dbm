module.exports = {
    CONNECT_ERROR:  {errno:-1001, code:'CONNECT_ERROR',   message:'cant connect the db server~'},
    TABLE_REQUIRED: {errno:-1002, code:'TABLE_REQUIRED',  message:"table required!"},
    SQL_INJECTION:  {errno:-1003, code:'SQL_INJECTION',   message:"you have sql keyword! ex:['drop ','delete ','truncate ',';','insert ','update ','set ','use ']"},
    UPDATE_ERROR:   {errno:-1004, code:'UPDATE_ERROR',    message:'Nothing changed!'},
    
    OBJECT_ID_NOT_FIND:     {errno:-1005,   code:'OBJECT_ID_NOT_FIND',  message:'Object does not find by id or more rows'},
    CONNECTION__IS_NULL:    {errno:-1006,   code:'CONNECTION__IS_NULL', message:"connection is null!"},
    DATA_TYPE_ERROR:        {errno:-1006,   code:'DATA_TYPE_ERROR', message:"Data Should be Object Or Array!"},
};
