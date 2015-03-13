Racoon.Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        ':smth': 'index',
        'post/:id': 'onePost'
    },
    index: function() {
        if(!Racoon.changed){
            Racoon.App.list.show(new Racoon.Views.Posts({collection: Racoon.App.posts}));
            $('#one').hide();
            $('aside,.content,.add').show();
        }
        else{
            Racoon.changed = false;
            Racoon.App.posts.fetch({
                success: function(){
                    Racoon.App.list.show(new Racoon.Views.Posts({collection: Racoon.App.posts}));
                    Racoon.changed = false;
                    $('#one').hide();
                    $('aside,.content,.add').show();
                }
            });
        }      
    },
    onePost: function(id) {
        if(!Racoon.changed){
            Racoon.App.one.show(new Racoon.Views.One({model: Racoon.App.posts.get(id)}));
            $('aside,.content').hide();
            $('#one').show();
        }
        else{
            Racoon.changed = false;
            Racoon.App.posts.fetch({
                success: function(){
                    Racoon.App.one.show(new Racoon.Views.One({model: Racoon.App.posts.get(id)}));
                    Racoon.changed = false;
                    $('aside,.content').hide();
                    $('#one').show();
                }
            });
        }
    }
});