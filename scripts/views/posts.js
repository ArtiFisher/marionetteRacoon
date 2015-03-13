Racoon.Views.Posts = Backbone.Marionette.CollectionView.extend({
    childView: Racoon.Views.Post,
    tagName: 'section',
    onBeforeRender: function(){
        this.collection = this.collection.byAuthor('arti');
    }
});