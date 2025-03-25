
export default async function handler(req, res){
    try{
        const res = await fetch(`${process.env.NODE_ENV}/all`);
        const data = await res.json();
        return res.status(200).json(data);
    }catch(err){
        res.status(200).send({message:"fasfdsa"});
    }
}