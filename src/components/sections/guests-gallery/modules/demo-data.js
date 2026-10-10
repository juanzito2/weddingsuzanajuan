// DADOS DEMONSTRATIVOS. Substituir por registos aprovados do backend quando estiver pronto.
// As imagens são placeholders remotos para teste visual; não são fotografias reais dos convidados.
const placeholder=(id,w=900,h=1100)=>`https://picsum.photos/id/${id}/${w}/${h}`;
export const demoGuests=[
{id:"g1",name:"Ana y Marcos",approved:true,stories:[{type:"image",src:placeholder(1011)},{type:"image",src:placeholder(1027)}]},
{id:"g2",name:"Daniela y Pedro",approved:true,stories:[{type:"image",src:placeholder(1005)}]},
{id:"g3",name:"Familia Oliveira",approved:true,stories:[{type:"image",src:placeholder(1035)},{type:"image",src:placeholder(1040)}]},
{id:"g4",name:"Beatriz",approved:true,stories:[{type:"image",src:placeholder(1062)}]},
{id:"g5",name:"Rafael y Clara",approved:true,stories:[{type:"image",src:placeholder(1074)}]},
{id:"g6",name:"Sofía",approved:true,stories:[{type:"image",src:placeholder(1084)}]}
];
export const demoPhotos=[1011,1027,1005,1035,1040,1062,1074,1084,1080].map((id,i)=>({id:`p${i+1}`,name:demoGuests[i%demoGuests.length].name,src:placeholder(id),alt:"Imagen ilustrativa de demostración",approved:true}));
