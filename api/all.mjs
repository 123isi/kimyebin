export default async function handler(req, res){
    const res = await fetch(`${process.env.NODE_ENV}/all`);
    const data = await res.json();
    return res.status(200).json(data);
}