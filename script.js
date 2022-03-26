$(function () {
    let pieces = createPieces(true);
    $("#puzzleContainer").html(pieces);
    //set time for countdown
    let timerElem = {
        minSet: 1,
        min: 1,
        sec: 0,
    };
    let timer = function () {
        timerInterval = setInterval(() => {
            if (timerElem.min != -1) {

                if (timerElem.min < 10) $('.time .min').html('0' + timerElem.min)
                else $('.time .min').html(timerElem.min);
                if (timerElem.sec < 10) $('.time .sec').html('0' + timerElem.sec)
                else $('.time .sec').html(timerElem.sec);

                if (timerElem.sec > 0) {
                    timerElem.sec--;
                }
                else {
                    timerElem.min--;
                    timerElem.sec = 59;
                }

                if (timerElem.min == 0 && timerElem.sec == 0) {
                    $('.modal-alert').addClass('show');
                    $('.border-alert').html("It's a pity, but you lost");
                    $('#btnCheck').addClass('hide');
                    $('.time').addClass('hide');
                    $('#puzzleContainer').css({
                        boxShadow: '0px 0px 30px rgb(165,42,42)'
                    });
                    $('#image').css({
                        boxShadow: '0px 0px 30px rgb(0,128,0)'
                    });
                    $('.modal-container').css({
                        backgroundColor: 'rgba(12, 0, 0, 0.7)',
                        zIndex: 3
                    });
                    $('#btnCheckGame').attr('disabled', true);
                    $('#btnCheckGame').addClass('button-disabled');
                }
            }
        }, 1000);
    }
    //set random position for pieces
    function start() {
        pieces = $('#puzzleContainer div');
        pieces.each(function () {
            let leftPos = Math.floor(Math.random() * 290) + "px";
            let topPos = Math.floor(Math.random() * 290) + "px";
            $(this).addClass("draggablePiece").css({
                position: 'absolute',
                left: leftPos,
                top: topPos
            });
            $('#pieceContainer').append($(this));
            let empty = createPieces(false);
            $('#puzzleContainer').html(empty);
        });
        paste();
    }
    start();
    //set drop for pieces from one box to another
    function paste() {
        $('.draggablePiece').draggable({
            revert: "invalid",
            start: function () {
                if ($(this).hasClass('droppedPiece')) {
                    $(this).removeClass('droppedPiece');
                    $(this).parent().removeClass('piecePresent');
                }
            }
        });
        $('.droppablePiece').droppable({
            hoverClass: "ui-state-highlight",
            accept: function () {
                return !$(this).hasClass('piecePresent');
            },
            drop: function (event, ui) {
                let draggableElem = ui.draggable;
                let dropOn = $(this);
                dropOn.addClass('piecePresent');
                $(draggableElem).addClass('droppedPiece').css({
                    top: 0,
                    left: 0,
                    position: 'relative'
                }).appendTo(dropOn);
                $('#btnCheckGame').removeClass('button-disabled');
                $('#btnCheckGame').removeAttr('disabled');
                $('#btnStart').attr('disabled', true);
                $('#btnStart').addClass('button-disabled');
            }
        });
    }
    //btnStart
    $('#btnStart').click(function () {
        paste();
        $('#btnCheckGame').removeClass('button-disabled');
        $('#btnCheckGame').removeAttr('disabled');
        $('#btnStart').attr('disabled', true);
        $('#btnStart').addClass('button-disabled');
        timer();
    });
    //btnCheckGame
    $("#btnCheckGame").click(function () {
        $('.modal-container').css({
            backgroundColor: 'rgba(12, 0, 0, 0.7)',
            zIndex: 3
        });
        if ($('#puzzleContainer .droppedPiece').length != 16) {
            $('.modal-alert').addClass('show');
            $('.border-alert').html(`You still have time, are you sure?`);
            $('.time').css({
                fontSize: '30px'
            });
        } else if ($('#puzzleContainer .droppedPiece').length == 16) {
            $('.modal-alert').addClass('show');
            $('.border-alert').html(`You still have time, are you sure?`);
            $('.time').css({
                fontSize: '30px'
            });
        }
    });
    //btnClose in modal-alert
    $('#btnClose').click(function () {
        $('.modal-alert').addClass('hide');
        $('.modal-alert').removeClass('show');
        $('.time').css({
            fontSize: '80px'
        })
        $('.time').removeClass('hide');
        $('.modal-container').css({
            backgroundColor: '#fff',
            zIndex: -1
        });
    });
    //btnCheck in modal-alert
    $('#btnCheck').click(function () {
        for (let k = 0; k < 16; k++) {
            let item = $("#puzzleContainer .droppedPiece:eq(" + k + ")");
            let order = item.data('order');
            if (k != order) {
                $('.border-alert').html("It's a pity, but you lost");
                $('#puzzleContainer').css({
                    boxShadow: '0px 0px 30px rgb(165,42,42)'
                });
                $('#image').css({
                    boxShadow: '0px 0px 30px rgb(0,128,0)'
                });
                $('#btnCheck').addClass('hide');
                $('.time').addClass('hide');
                clearInterval(timerInterval);
            } else {
                $('.modal-alert').addClass('show');
                $('.border-alert').html('Woohoo, well done! You did it!');
                $('#puzzleContainer').css({
                    boxShadow: '0px 0px 30px rgb(0,128,0)'
                });
                $('#image').css({
                    boxShadow: '0px 0px 30px rgb(0,128,0)'
                });
                $('#btnCheck').addClass('hide');
                $('.time').addClass('hide');
                $('#btnCheckGame').attr('disabled', true);
                $('#btnCheckGame').addClass('button-disabled');
                clearInterval(timerInterval);
            }
        }
    });
    //btnNewGame
    $("#btnNewGame").click(function () {
        let newPieces = createPieces(true);
        $('#puzzleContainer').html(newPieces);
        $('#puzzleContainer').empty();

        let randomPieceAnim = setInterval(function () {
            $("#puzzleContainer").empty();
            $("#puzzleContainer").html(pieces);
            start();
            paste();
        }, 500);
        setTimeout(function () {
            clearInterval(randomPieceAnim);
        }, 3000);

        $('#btnCheckGame').addClass('button-disabled');
        $('#btnCheckGame').attr('disabled', true);
        $('#btnStart').attr('disabled', false);
        $('#btnStart').removeClass('button-disabled');
        clearInterval(timerInterval);
        timerElem.sec = 0;
        timerElem.min = 1;
        $('.time .min').html('01');
        $('.time .sec').html('00');
        $('#puzzleContainer').css({
            boxShadow: '0px 0px 30px rgb(128,128,128)'
        });
        $('#image').css({
            boxShadow: '0px 0px 30px rgb(128,128,128)'
        });
        $('#btnCheck').removeClass('hide');
    });

    function createPieces(withImage) {
        let rows = 4, columns = 4;
        let pieces = '';
        for (let i = 0, top = 0, order = 0; i < rows; i++, top -= 100) {
            for (let j = 0, left = 0; j < columns; j++, left -= 100, order++) {
                if (withImage) {
                    pieces += "<div style='background-position:"
                        + left + "px " + top + "px;' class='piece' data-order=" + order + "></div>";
                }
                else {
                    pieces += "<div style='background-image:none;' class='piece droppablePiece'></div>";
                }
            }
        }
        $('#puzzleContainer').css({
            boxShadow: '0px 0px 30px rgb(128,128,128)'
        });
        $('#image').css({
            boxShadow: '0px 0px 30px rgb(128,128,128)'
        });
        return pieces;
    }
})