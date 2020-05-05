import "./styles/style.css"
import json from "./assets/json.json";
import Post from "@models/Post";
import WebpackLogo from "./assets/webpack-logo.png";
import xml from "./assets/data.xml";
import csv from "./assets/data.csv"
import * as $ from "jquery";
import './styles/stylus.stylus';
import './styles/scss.scss';
import './babel';

const post = new Post("Webpack Post Title!", WebpackLogo);


$('pre').html(post.toString());


// console.log("post", post.toString());
// console.log("json", json);
// console.log("xml", xml);
// console.log("csv", csv);