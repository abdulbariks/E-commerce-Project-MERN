const fs =require('fs').promises;

const deleteImage = async(userImagePath)=>{
try {
    await fs.access(userImagePath)
    await fs.unlink(userImagePath)
    console.log("User Image was Deleted")  
} catch (error) {
    console.error("User Image does not Exist")
}
}

// const deleteImage = (userImagePath)=>{
//     fs.access(userImagePath)
//     .then(()=>fs.unlink(userImagePath))
//     .then(()=>console.log("User Image was Deleted"))
//     .catch((err)=>console.error("User Image does not Exist"))
// }


module.exports = {deleteImage};