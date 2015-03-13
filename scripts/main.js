(function() {
    var postsCol,
        postsView,
        renderedMain,
        disabled;

    var template = function(id) {
        return _.template($('#' + id).html());
    };

    var vent = _.extend({}, Backbone.Events);

    var requester = function(callback, id) {
        callback(id);
        if (!postsCol) {
            NProgress.start();
            postsCol = new Racoon.Collections.Posts();
            postsCol.fetch({
                success: function() {
                    console.log('fetching');
                    postsView = new Racoon.Views.Posts({
                        collection: postsCol
                    });
                    renderedMain = postsView.render().el;
                    NProgress.done();
                    vent.trigger('received');
                }
            });
        }
    }

    var contentInit = function() {
        var content = $('.content');
        content.empty();
        content.append($('#aside').html());
        content.append($('#addButton').html());
        $('.add').on('click', Racoon.CreationForm.add);
    }

    window.Racoon = {
        Models: {},
        Collections: {},
        Views: {},
        CreationForm: {},
        init: function() {
            new Racoon.Router;
            Backbone.history.start();
            Racoon.CreationForm.init();
            vent.on('received', function() {
                console.log('received');
            })
        },
        mainPage: function() {
            $('header').removeClass('cut');
            var content = $('.content');
            if (postsCol) {
                contentInit();
                if (!renderedMain) {
                    postsView = new Racoon.Views.Posts({
                        collection: postsCol
                    });
                    renderedMain = postsView.render().el;
                }
                content.append(renderedMain);
            } else {
                vent.on('received', function() {
                    contentInit();
                    content.append(renderedMain);
                });
            }

        },
        onePost: function(id) {
            var postView,
                content = $('.content');
            $('header').addClass('cut');
            if (postsCol) {
                content.empty();
                postView = new Racoon.Views.Post({
                    model: postsCol.get(id)
                });
                content.append(postView.render(true).el);
            } else {
                vent.on('received', function() {
                    content.empty();
                    postView = new Racoon.Views.Post({
                        model: postsCol.get(id)
                    });
                    content.append(postView.render(true).el);
                });
            }
        },
        delete: function(id) {
            var model = postsCol.get(id);
            console.log(model);
            model.destroy({
                url: postsCol.url + '/' + id,
                success: function() {
                    console.log(postsCol);
                    postsView.render();
                }
            });
        }
    };

    Racoon.CreationForm.init = function() {
        $('.submit').on('click', Racoon.CreationForm.submit);
        $('.cancel').on('click', Racoon.CreationForm.cancel);
    }

    Racoon.CreationForm.add = function() {
        var popUp = $('.popUp').toggle();
        $('.popUp input, textarea').val('');
    }

    Racoon.CreationForm.submit = function() {
        var popUp = $('.popUp').toggle();
        var model = new Racoon.Models.Post();
        model.url = postsCol.url;
        model.attributes.author = $('.popUp [name="author"]').val();
        model.attributes.title = $('.popUp [name="title"]').val();
        model.attributes.text = $('.popUp [name="text"]').val();
        model.attributes.image = $('.popUp [name="url"]').val();
        model.attributes.date = new Date();
        model.save({}, {
            success: function() {
                postsCol = null;
                requester(Racoon.mainPage);
            }
        });
    }

    Racoon.CreationForm.cancel = function() {
        var popUp = $('.popUp').toggle();
    }

    Racoon.Models.Post = Backbone.Model.extend({
        idAttribute: '_id'
    });

    Racoon.Collections.Posts = Backbone.Collection.extend({
        model: Racoon.Models.Post,
        url: "http://54.72.3.96:3000/posts"
    });

    Racoon.Views.Post = Backbone.View.extend({
        tagName: 'article',
        template: template('blogPost'),
        events: {
            'click .destroy': 'destroy',
            'click .edit': 'edit',
            'click .save': 'save'
        },
        render: function(forOnePost) {
            var origin = this.model.attributes,
                copy = {};

            for (var attrname in origin) {
                copy[attrname] = origin[attrname];
            }
            copy.date = this.dateFilter(origin.date);
            if (forOnePost) {
                var oneTemplate = template('onePost');
                this.$el.html(oneTemplate(copy));
            } else {
                this.$el.html(this.template(copy));
            }
            return this;
        },
        destroy: function() {
            this.model.destroy();
            this.$el.remove();
        },
        edit: function() {
            $('.lonely').addClass('editing');
            $('.lonely input,textarea').prop('disabled', false);
        },
        save: function() {
            $('.lonely').removeClass('editing');
            $('.lonely input,textarea').prop('disabled', true);
            this.model.attributes.title = $('.lonely [name="title"]').val();
            this.model.attributes.text = $('.lonely [name="text"]').val();
            this.model.attributes.image = $('.lonely [name="image"]').val();
            this.model.attributes.date = new Date();
            $('.lonely info span').val(this.dateFilter(new Date()));
            $('.lonely img').attr('src', this.model.attributes.image);
            this.model.save();
        },
        dateFilter: function(input) {
            var options = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            var date = new Date(input);
            var now = date.toLocaleTimeString('en-us', options).split(', ');
            if (!now[2]) {
                return 'no date';
            }
            return '' + now[2] + ' ' + now[0] + ', ' + now[1];

        }
    });

    Racoon.Views.Posts = Backbone.View.extend({
        tagName: 'section',
        render: function() {
            this.collection.each(function(post) {
                var postView = new Racoon.Views.Post({
                    model: post
                });
                if (postView.model.attributes.author && postView.model.attributes.author == 'arti') {
                    this.$el.append(postView.render().el);
                }
            }, this);
            return this;
        }
    });

    Racoon.Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            ':smth': 'index',
            'post/:id': 'onePost'
        },
        index: function() {
            requester(Racoon.mainPage);
        },
        onePost: function(id) {
            requester(Racoon.onePost, id);
        }
    });

    Racoon.init();

})();
