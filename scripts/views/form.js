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