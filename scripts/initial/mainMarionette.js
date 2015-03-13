(function() {
    var template = function(id) {
        return _.template($('#' + id).html());
    };

    var vent = _.extend({}, Backbone.Events);

    window.Racoon = {
        Models: {},
        Collections: {},
        Views: {},
        App: new Backbone.Marionette.Application(),
        changed: true
    };

    Racoon.dateFilter = function(input){
        var options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
            date = new Date(input),
            now = date.toLocaleTimeString('en-us', options).split(', ');
        if (!now[2]) {
            return 'no date';
        }
        return '' + now[2] + ' ' + now[0] + ', ' + now[1];
    };

    Racoon.Models.Post = Backbone.Model.extend({
        idAttribute: '_id'
    });

    Racoon.Collections.Posts = Backbone.Collection.extend({
        model: Racoon.Models.Post,
        url: 'http://54.72.3.96:3000/posts',

        byAuthor: function(author) {
            var filtered = this.filter(function(post) {
                return post.get('author') === author;
            });
            return new Racoon.Collections.Posts(filtered);
        }
    });

    Racoon.Views.One = Backbone.Marionette.ItemView.extend({
        template:'#onePost',
        className: 'lonely',
        events: {
            'click .edit': 'edit',
            'click .save': 'save'
        },
        ui: {
            title: '#oneTitle',
            text: '#oneText',
            url: '#oneUrl',
            date: '#oneDate',
            image: '#oneImage'
        },
        edit: function() {
            $('.lonely').addClass('editing');
            $('.lonely input,textarea').prop('disabled', false);
        },
        save: function() {
            $('.lonely').removeClass('editing');
            $('.lonely input,textarea').prop('disabled', true);
            this.model.attributes.title = this.ui.title.val();
            this.model.attributes.text = this.ui.text.val();
            this.model.attributes.image = this.ui.url.val();
            this.model.attributes.date = new Date();
            this.model.url = Racoon.App.posts.url + '/' + this.model.id;
            this.ui.date.html(Racoon.dateFilter(this.model.attributes.date));
            this.ui.image.attr('src', this.model.attributes.image);
            this.model.save();
        }
    });

    Racoon.Views.Post = Backbone.Marionette.ItemView.extend({
        template: template('blogPost'),
        tagName: 'article',
        events: {
            'click .remove': 'removePost'
        },
        removePost: function() {
            this.model.url = this.model.collection.url + '/' + this.model.id;
            this.model.collection.remove(this.model);
            this.model.destroy();
        }
    });

    // Racoon.Views.NoPosts = Backbone.Marionette.ItemView.extend({
    //     template:'#noPosts'
    // });

    Racoon.Views.Posts = Backbone.Marionette.CollectionView.extend({
        childView: Racoon.Views.Post,
        // emptyView: Racoon.Views.NoPosts,
        tagName: 'section',
        onBeforeRender: function(){
            this.collection = this.collection.byAuthor('arti');
        }
    });

    Racoon.Views.Form = Backbone.Marionette.ItemView.extend({
        template:'#formView',
        events: {
            'click .submit': 'submit',
            'click .cancel': 'cancel'
        },
        ui: {
            author: '#author',
            title: '#title',
            text: '#text',
            url: '#url'
        },
        submit: function(){
            $('#popUp').hide();
            var model = new Racoon.Models.Post(
                {
                    author: this.ui.author.val(),
                    title: this.ui.title.val(),
                    text: this.ui.text.val(),
                    image: this.ui.url.val(),
                    date: new Date()
                }
            );
            model.url = Racoon.App.posts.url;
            model.save({}, {
                success: function(response){
                    Racoon.App.posts.add(model);
                    Racoon.App.list.show(new Racoon.Views.Posts({collection: Racoon.App.posts}));
                }
            });
            this.ui.author.val('');
            this.ui.title.val('');
            this.ui.text.val('');
            this.ui.url.val('');
        },
        cancel: function(){
            $('#popUp').hide();
        }
    });

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

    Racoon.App.addRegions({
        form: '#form',
        list: '#list',
        one: '#one'
    });

    Racoon.App.addInitializer(function() {
        Racoon.App.posts = new Racoon.Collections.Posts();
        $('.add').on('click', function(){
            Racoon.App.form.show(new Racoon.Views.Form());
            $('#popUp').show();
        });
        new Racoon.Router;
        Backbone.history.start();
    });

    Racoon.App.start();

})();
