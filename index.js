
const yargs = require('yargs')
const path =require('path')
const fs= require('fs')



const args = yargs
.usage('Usage: node $0 [options]')
.help('help')
.alias('help','h')
.version('0.0.1')
.alias('version','v')
.option('entry', {
  alias: 'e',
  describe: 'Указывает путь к читаемой директории',
  demandOption: true
})
.option('dist', {
   alias:'d',
   describe:'Путь куда выложить',
   default: './dist'
})
.option('delete',{
    alias: 'D',
    describe: 'Будет ли удалять?',
    default: false,
    boolean: true
})
.argv

const config= {
 entry: path.normalize(path.resolve(__dirname, args.entry)),
 dist: path.normalize(path.resolve(__dirname, args.dist)),
 isDelete: args.delete
}

function createDir(src, cb){
     //проверка есть ли папка
     if(!fs.existsSync(src)){
         fs.mkdir(src,(err)=>{
        
            if(err)  throw err


            cb()
         })
     }else{
        cb()
     }
}

function sorter(src){
 fs.readdir(src,(err, files)=>{
      if(err)  throw err
      
      files.forEach(file=>{
          const curPath=path.resolve(src, file)
          
          fs.stat(curPath,(err, stat)=>{
            if(err)  throw err

            if(stat.isDirectory()){
               sorter(curPath)
            }else
            {
               createDir(config.dist, ()=>{
                     const innerPath=path.resolve(config.dist, file.charAt(0).toLowerCase())
                    createDir(innerPath,()=>{
                        fs.copyFile(curPath, path.resolve(innerPath,file),(err)=>{
                            if(err)  throw err
                        })
                    })
               }) 
            }
          })
      })

 })

}

sorter(config.entry)