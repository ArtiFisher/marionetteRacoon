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