$(function() {
    whiteboard = new Whiteboard('#whiteboard');
});

Whiteboard = (function() {
    var WhiteboardConstructor;

    WhiteboardConstructor = function(selector) {
        if (false === (this instanceof Whiteboard)) {
            return new Whiteboard(selector);
        }

        this.$whiteboard = $(selector || 'body').first();
        this.$whiteboard.addClass("whiteboard-wrapper");
        this.$editor = $('textarea');

        this.noteColors = {
            98: '#ccf', //blue
            99: '#cff', //cyan
            103: '#cfc', //green
            109: '#fce', //magenta
            111: '#fec', //orange
            112: '#fcf', //purple
            114: '#fcc', //red
            116: '#cff', //teal
            119: '#fff', //white
            121: '#ffc' //yellow
        };

        this.$currentNote = undefined;
        this.$pinnedNote = undefined;
        this.$editingNote = undefined;
        this.zIndex = 1000;

        this.registerEventHandlers();
        this.registerInputHandlers();
        this.registerNoteEventHandlers();
    };

    WhiteboardConstructor.prototype.registerEventHandlers = function() {
        var that = this;

        this.$whiteboard.click(function(e) {
            // If we're currently editing submit note before creating
            if (typeof that.$editingNote !== 'undefined') {
                that.submitNote();
            }

            var new_note = that.makeNote(e);
            that.editNote(new_note);
        });

        $('body').keypress(function(e) {
            console.log(e.which);
            if (typeof that.$currentNote !== 'undefined' & typeof that.$editingNote === 'undefined') {
                console.log('changing color: ' + that.noteColors[e.which]);
                that.$currentNote.css('background-color', that.noteColors[e.which]);
            }
        });
    };

    WhiteboardConstructor.prototype.registerInputHandlers = function() {
        var that = this;

        this.$whiteboard.on('keydown', '#$editor', function(e) {
            console.log(e.which + ' in $editor');
            switch (e.which) {
                case 13:
                    that.submitNote();
                    break;
                case 27:
                    that.cancelNote();
                    break;
            }
        });

        // Rejigger font size down to 18pt
        this.$whiteboard.on('keyup', '#$editor', function(e) {
            while (e.currentTarget.scrollHeight > e.currentTarget.offsetHeight && parseInt($(e.currentTarget).css('font-size')) > 20) {
                var newFontSize = parseInt($(e.currentTarget).css('font-size'))-1;
                $(e.currentTarget).css('font-size', newFontSize);
            }
        });
    };

    WhiteboardConstructor.prototype.registerNoteEventHandlers = function() {
        var that = this;

        // Register mouseover for color changes
        this.$whiteboard.on('mouseover', '.note', function(e) {
            that.$currentNote = $(e.currentTarget);
            console.log('mouseover');
        });

        // Register mouseout to not allow color changes
        this.$whiteboard.on('mouseout', '.note', function(e) {
            that.$currentNote = undefined;
            console.log('mouseout');
        });

        // Register offset position for drag start
        this.$whiteboard.on('mousedown', '.note', function(e) {
            that.$pinnedNote = $(e.currentTarget);
            that.$pinnedNote.xOffset = e.offsetX;
            that.$pinnedNote.yOffset = e.offsetY;
            console.log('mousedown');
        });

        this.$whiteboard.on('click', '.note', function(e) {
            console.log('click');

            if (typeof that.$currentNote !== 'undefined') {
                if (!that.$pinnedNote.moved) {
                    that.editNote(that.$pinnedNote);
                }

                delete that.$pinnedNote.moved;
                that.$pinnedNote = undefined;
                return false;
            }
        });

        this.$whiteboard.mousemove(function(e) {
            if (typeof that.$pinnedNote !== 'undefined') {
                that.$pinnedNote.moved = true;
                that.$pinnedNote.css({
                    'z-index': ++that.zIndex,
                    'top': e.pageY - that.$pinnedNote.yOffset,
                    'left': e.pageX - that.$pinnedNote.xOffset
                });
                that.$editor.css({
                    'z-index': that.zIndex,
                    'top': e.pageY - that.$pinnedNote.yOffset,
                    'left': e.pageX - that.$pinnedNote.xOffset
                });
            }
        });

        this.$whiteboard.on('dblclick', '.note', function(e) {
            $(e.currentTarget).remove();
            return false;
        });
    };

    WhiteboardConstructor.prototype.editNote = function(note) {
        if (note.children('textarea').length > 0) {
            //already editing this note
            return;
        }

        this.$editingNote = note;
        this.$editingNote.previousVal = this.$editingNote.text();
        this.$editingNote.html('');
        this.$editor.appendTo(this.$editingNote);
        this.$editor.css({
            top: this.$editingNote.offset().top,
            left: this.$editingNote.offset().left,
            width: this.$editingNote.width(),
            height: this.$editingNote.height(),
            'font-size': this.$editingNote.css('font-size')
        }).val(this.$editingNote.previousVal).show().focus().select();
    };

    WhiteboardConstructor.prototype.uneditNote = function() {
        this.$editor.hide().val('').appendTo('body');
        this.$editingNote = undefined;
    };

    WhiteboardConstructor.prototype.submitNote = function() {
        console.log('writing: ' + this.$editor.val());
        this.$editingNote.html(this.$editor.val());
        this.$editingNote.css('font-size', this.$editor.css('font-size'));
        this.uneditNote();
    };

    WhiteboardConstructor.prototype.cancelNote = function() {
        this.$editingNote.html(this.$editingNote.previousVal || '');
        this.uneditNote();
    };

    WhiteboardConstructor.prototype.makeNote = function(e) {
        $('#instructions').hide();

        var note_size = 150;
        var note_color = '#ffc';

        var note_template = $('<div>');
        note_template.addClass('note');
        note_template.css({
            'width': note_size,
            'height': note_size,
            'background-color': note_color,
            'position': 'absolute',
            'font-size': '48px',
            'z-index': ++this.zIndex
        });

        var note = note_template.clone();
        note.css({
            top: e.pageY - note.height()/2,
            left: e.pageX - note.width()/2
        });

        this.$whiteboard.append(note);
        note.previousVal = '';
        this.$currentNote = note;

        return note;
    };

    return WhiteboardConstructor;

}());
