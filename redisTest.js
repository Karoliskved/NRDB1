const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.log('Redis error', err))

async function setProduct(companyName, productName, quantity) {
  const key = formatKey(companyName, productName)
  await client.connect()
  await client.set(key, quantity)
  client.disconnect()
}

const formatKey = (companyName, productName) =>{
    return companyName + ":" + productName
}

const buyProduct = async (key, clientNumber) => {
  try {
      const client = redis.createClient()
      await client.connect()
      
      await client.watch(key)
      const result = await client.get(key)
      const productCount = parseInt(result)
      if (productCount > 0) {
          const multi = client.multi()
          multi.set(key, productCount - 1)
          const results = await multi.exec()
          if (results.length === 0) {
              console.log("Client "+ clientNumber + " failed to buy the product with compound key: "+ key)
          }
          else {
              console.log("Client "+ clientNumber + " successfuly bought the product with compound key: "+ key)
          }
      }
      else {
        console.log("Client "+ clientNumber + " failed to buy the product with compound key: "+ key+" out of stock")
      }
      client.disconnect()
  } catch (error) {
      if (error instanceof redis.WatchError) {
          console.log("Transaction failed","Client "+ clientNumber + " failed to buy the product with compound key: "+ key)
      }else{
          console.log(error)
      }
  }
}
const companyName = "company1"
const productName = "product1"
const productQuantity = 2
setProduct(companyName,productName,productQuantity)
const compoundKey = formatKey(companyName,productName)
buyProduct(compoundKey, 1)
setTimeout(()=>{
  buyProduct(compoundKey, 2)
},3000)
buyProduct(compoundKey, 3)



