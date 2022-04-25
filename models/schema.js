const graphql = require('graphql');
const Users = require('./users');
const Categories = require('./category');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
} = graphql;

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  },
});
// const aggr = Categories.aggregate([
//   {"$group":{
//     "_id": 'parentId',
//     'sub': { '$parentId': '$id' }
//   }}
// ])
// Categories.where('parentId').equals('id').exec(function (err, result) {
//   if (err){
//       console.log(err)
//   }else{
//       console.log("Result :", result) 
//   };
// })

const sub = new GraphQLObjectType({
  name:'sub',
  fields:()=>({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLString,
    },
    subCategory: {
      type: sub,
      resolve:async(parent, args)=>{
        const data = await Categories.findOne({parentId: parent.id}).exec()
        return data
      }
    }

  })
})
const Category = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLString,
    },
    subCategory: {
      type: sub,
      resolve:async(parent, args)=>{
        const data = await Categories.findOne({parentId: parent.id}).exec()
        return data
      }
    }
  },
});
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve(parent, args) {
        return Users.find();
      },
    },
    categories: {
      type: new GraphQLList(Category),
      resolve(parent, args) {
        return Categories.find();
      },
    },
    user: {
      type: User,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Users.findById(args.id);
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUsers: {
      type: User,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const user = new Users({
          name: args.name,
          email: args.email,
        });
        return user.save();
      },
    },
    createCategory: {
      type: Category,
      args: {
        name: { type: GraphQLString },
        parentId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const category = new Categories({
          name: args.name,
          parentId: args.parentId,
        });
        return category.save();
      },
    },
    editUsers: {
      type: User,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Users.findByIdAndUpdate({
          _id: args.id,
          name: args.name,
          email: args.email,
        });
      },
    },
    deleteUsers: {
      type: User,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Users.findByIdAndDelete({
          _id: args.id,
        });
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
