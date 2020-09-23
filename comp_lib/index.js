const express = require('express');
const app = express();
const pool = require('./pg_db');


const PORT = 3000;

app.use(express.json());

//get all
app.get('/compid',async(req, res)=>{

	try{

		const allCompIds = await pool.query('SELECT * FROM comp_lib_name');

		res.json(allCompIds.rows);
	}
	catch(err){
		console.error(err.message);
	}
});

//get for specific ID
app.get('/compid/:id',async(req, res)=>{
	const {id} = req.params;
	const compID = req.params.id;
	try{
		const CompId = await pool.query("SELECT * FROM comp_lib_name WHERE id = " + "'" + compID +"'");
		res.json(CompId.rows[0]);
	}
	catch(err){
		console.error(err.message);
	}
});

//update record
app.put('/compid/:id',async(req, res)=>{
	const {id} = req.params;
	const {comp_data} = req.body;
	try{
		const CompId = await pool.query('UPDATE comp_lib_name SET comp_name = $1, comp_desc = $2 WHERE id = $3',[req.body.comp_name, req.body.comp_desc, id]);
		res.json("Record successfully updated");
	}
	catch(err){
		console.error(err.message);
	}
});

//Delete record
app.delete('/compid/:id',async(req, res)=>{
	const {id} = req.params;

	try{
		const CompId = await pool.query('DELETE FROM comp_lib_name WHERE id = $1',[id]);
		res.json("Record successfully deleted");
	}
	catch(err){
		console.error(err.message);
	}
});

app.post('/comp_lib', async(req, res)=>{
	try {
		const univID = await pool.query("SELECT uuid_generate_v1()");
		const univIDval = univID.rows[0].uuid_generate_v1;
		const newCompLib = await pool.query("INSERT INTO comp_lib_name(	id,comp_name, comp_desc, created_by, is_active ) VALUES ( " + 
										"'" + univIDval +"'," +
										"'" + req.body.comp_name +"'," +
										"'" + req.body.comp_desc +"',"+
										"'" + req.body.created_by +"',"+
										"'" + req.body.is_active +"' )");
	res.json(newCompLib.rows[0]);
	}
	catch (err){
		console.error(err.message);
	}
});


app.listen(PORT, ()=>{
	console.log("Server listening at Port " + PORT);
});