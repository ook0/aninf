import firebase from './Firebase';
import { User } from './User';

export class Knowledge {
  static collection = () => { return firebase.firestore().collection("knowledges") }

  constructor(id, title, summary, source, createdAt, updatedAt, author){
    this.id        = id;
    this.title     = title;
    this.summary   = summary;
    this.source    = source;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt; 
    this.author    = author;
  }

  static build = async (knowledge) => {
    const { id } = knowledge;
    let { title, summary, source, createdAt, updatedAt, author } = knowledge.data();
    author = await User.findByID(author);
    if(author) return new Knowledge(id, title, summary, source, createdAt, updatedAt, author);
    else return false;
  }

  static buildMultiple = async (knowledges) => {
    let buildedKnowledges = [];
    for(const knowledge of knowledges){
      const builded = await Knowledge.build(knowledge);
      if(builded) buildedKnowledges.push(builded);
      else return false;
    }
    return buildedKnowledges;
  }

  static create = async (knowledge) => {
    let status = false;
    await Knowledge.collection().add(knowledge)
    .then(() => status = true)
    .catch(err => console.error(err))
    return status;
  }

  static getToday = async () => {
    let knowledges = false;
    const date = new Date();
    const yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
    await Knowledge.collection().where("createdAt", ">", yesterday).get()
    .then(async docs => {
      if(docs.size > 0){
        knowledges = await Knowledge.buildMultiple(docs.docs);
      } else {
        knowledges = [];
      }
    })
    .catch(err => console.error(err));
    return knowledges;
  }
}