Racoon.Views.Post = Backbone.Marionette.ItemView.extend({
    template: '#blogPost',
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