/*global BackboneGen, $*/

// $(document).ready(function () {
//     'use strict';
//     Racoon.init();
// });

// var MyModel = Backbone.Model.extend({
//     idAttribute: '_id',
//     url: "http://54.72.3.96:3000/posts"
// });
// var MyCollection = Backbone.Collection.extend({
//     model:MyModel,
//     url: "http://54.72.3.96:3000/posts"
// });

// collection = new MyCollection();

// var mod = new MyModel();


//                   Get + Update(PUT) ~ Add
// mod.fetch({
//     success: function(){
//         mod.set({title:"Penguinische"});
//         mod.save();
//     }
// });


//                   Create(POST) ~ Update
// mod.set({
//     author: "arti",
//     title: "Clonchik",
//     text: "phantom text",
//     date: new Date(),
//     image: "http://www.get-covers.com/wp-content/uploads/2014/09/large-4.jpg"
// });
// mod.save();


//                    Get all(GET) ~ All
// collection.fetch({
//     success: function(){
//         console.log(collection);
//     }
// });


//                    Get by id(GET) ~ Get
// mod.fetch({
//     url: mod.url + '/54e4a58afef38b74188ed07a',
//     success: function(){
//         console.log(mod);
//     }
// });


//                    Delete(DELETE) ~ Delete
// isNew false?
// mod.destroy({
//     url: mod.url + '/54fe9d21fef38b74188ed0e0',
//     success: function(){
//         console.log('deleted?');
//     }
// });