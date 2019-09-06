#!/usr/bin/env node
const fs = require('fs');
const FileHound = require('filehound');
var path = require('path');
const fetch = require('node-fetch');
const marked = require('marked');

//F(x): read each file (from function mdLinks) and create object with properties
//with properties href, text, file to push in let links 
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
            console.log(err);
            } else {
                //Array contain objects for each link with its properties {href, text, file}
                let links = [];
                const renderer = new marked.Renderer();
                renderer.link = (href, title, text) => {
                    links.push({
                        href: href,
                        text: text,
                        file: file
                    })
                } 
                marked(data, {renderer: renderer});
                resolve(links);
            }
        });
    })
}
//F(x) mdLinks
const mdLinks = (userPath, options) => {
    return new Promise ((resolve, reject) => {
        console.log('RUTA ABSOLUTA',userPath);
        console.log('OPCIONES',options);
        if (options.validate == true && options.stats == true) {
            console.log("AMBAS");
        } else if (options.validate == true) {
            console.log("VALIDATE");
            readRoute(userPath, options);
        } else if (options.stats == true) {
            console.log("STATS");
            readRoute(userPath, options);       
        } else {
            console.log("NINGUNA");
            readRoute(userPath, options);
        }
    })
}

//F(x): verify if is directory or file
const readRoute = (route, options) => {
    fs.lstat(route, (error, stats) => {
        if(error) {
            return console.log('Ruta mal ingresada', error); //Return path's error
        } else {
            console.log('IS DIRECTORY', stats.isDirectory());
            if (stats.isDirectory()) { //If is a directory path's
                const files = FileHound.create()
                .discard('node_modules') //Except file node_modules
                .paths(route)
                .ext('md') //Verify file extension is 'md'
                .find()
                files //All '.md' files found in the directory
                .then(res => {
                    if (res.length == 0 ) { //If NOT exists '.md' files in the directory
                        console.log('No hay archivos .md')
                    } else { //If exists '.md' file in the directory
                        res.forEach(file => { //Extract a file from array files
                            console.log('SE ENVIA ARCHIVO A READFILE');
                            readFile(file) //Pass file to f(x) markdown
                            .then(res => {
                                if (options.validate) {
                                    validate(res);
                                } if (options.stats) {
                                    statsOption(res);
                                }else {
                                    console.log('POR DEFECTO', res); 
                                }
                            })
                        }
                    )}
        });
            } else { //Or is a file path's
                if (path.extname(route) != '.md') { //If NOT a '.md' file
                    console.log('Este archivo no es .md')
                } else { //Or is a '.md' file
                    readFile(route)
                        .then(res => {
                            if (options.validate) {
                                validate(res);
                            } if (options.stats) {
                                statsOption(res);
                            }else {
                                console.log('POR DEFECTO', res); 
                            }
                        })
                }
            }
        }
    })
}

//F(x) if user enter 'validate' option
const validate = (urls) => {
    return new Promise((resolve, reject) => {
        let arrValidate = [];
        let argsLinks = {};
        urls.forEach(url => {
            fetch(url.href)
            .then(res => {
                    argsLinks.href = url.href;
                    argsLinks.text = url.text;
                    argsLinks.file = url.file;
                    argsLinks.status = res.status;
                    argsLinks.statusText = res.statusText;
                    console.log('VALIDATE OPTION', arrValidate)
                })
            })
        resolve(arrValidate.push(argsLinks));
    })
}
//F(x) if user enter 'stats' option
const statsOption = (urls) => {
    return new Promise((resolve, reject) => {
        let totalLinks = urls.length;
        console.log('Total', totalLinks);
})
}
module.exports = { mdLinks };
