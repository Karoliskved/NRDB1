import { createClient } from 'redis';
console.log('test2')
const client = createClient({
    url: 'redis://default:redispw@localhost:49153'
  });

client.on('error', (err) => console.log('Redis Client Error', err));
console.log('test2')
await client.connect();
console.log('test3')
const companyProductKey='company1:produc1'
const keyValue='8'
await client.set(companyProductKey, keyValue);
const value = await client.get(companyProductKey);
console.log('test5')
console.log(keyValue)
client.keys("*")
async function setProductkey(companyName, productName, keyValue){
  const key=companyName+":"+productName
  await client.set(key, keyValue);
  const value = await client.get(key);
  console.log(value)
}
console.log("hello")
setProductkey('test', 'test2', '5')