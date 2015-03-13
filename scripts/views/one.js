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