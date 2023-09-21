exports.getStudents = async (req, res)=>{
    try{
        const result = await studentsCollections.find().toArray();
        // console.log(result)
        res.send(result)
    }
    catch(e){
        console.log(e)
    }
    
}

