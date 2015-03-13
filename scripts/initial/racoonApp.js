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