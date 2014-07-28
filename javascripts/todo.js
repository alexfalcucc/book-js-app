$(function(){

    var login = "alex.falcucci@gmail.com";
    var server = "http://livro-capitulo07.herokuapp.com";

    var $lastClicked;

    function updateTarefa(text, id){
        $.post(server + '/tarefa', {tarefa_id: id, texto: text});
    }

    //on click in the icon.
    function onTarefaDeleteClick(){
        $(this).parent('.tarefa-item').off('click').hide('slow', function(){
            $this = $(this);

            $.post(server + "/tarefa", {usuario:login, tarefa_id:$this.children('.tarefa-id').text(),
            _method: "DELETE"});

        $(this).remove();
        });
    }

    function newTarefa(text, $div){
        $.post(server + "/tarefa", {usuario:login, texto:text, _method: "PUT"}).done(function(data){
            $div.text(data, id);
        });
    }
    
    //add new task, ok.
    function addTarefa(text, id){
        id = id || 0;
        var $tarefa = $("<div />")
                  .addClass("tarefa-item")
                  .append($("<div />")
                          .addClass("tarefa-id")
                          .text(id))
                  .append($("<div />")
                          .addClass("tarefa-text")
                          .text(text))
                  .append($("<div />")
                          .addClass("tarefa-delete"))
                  .append($("<div />")
                          .addClass("clear"));

        $("#tarefa-list").append($tarefa);
        $(".tarefa-delete").click(onTarefaDeleteClick);
        $(".tarefa-item").click(onTarefaItemClick);

       if(id === 0) {
          var div = $($tarefa.children(".tarefa-id"));
          console.log("id", div);
          newTarefa(text, $(div));
        }
    }

    //press enter for include tasks.
    function onTarefaKeydown(event){
        if(event.which === 13){
            addTarefa($("#tarefa").val());
            $("#tarefa").val("");
        }
    }   

    //press enter for edit tasks.
    function onTarefaEditKeydown(){
        if(event.which === 13){
            savePendingEdition($lastClicked);
            $lastClicked = undefined;
        }
    }

    //callback on clicked for edit tasks.
    function onTarefaItemClick(){
        if(!$(this).is($lastClicked)){
            if($lastClicked !== undefined){
                savePendingEdition($lastClicked);
            }

        $lastClicked = $(this);

        var text = $lastClicked.children('.tarefa-text').text();
        var id = $lastClicked.children('.tarefa-id').text();

        var content = "<div class='tarefa-id'>" + id + "</div>" + 
                      "<input type='text' class='tarefa-edit' value='" + 
                      text + "'>";

        $lastClicked.html(content);
        $(".tarefa-edit").keydown(onTarefaEditKeydown);
        }
    }

    //save tasks.
    function savePendingEdition($tarefa) {
    var text = $tarefa.children('.tarefa-edit').val();
    var id = $tarefa.children('.tarefa-id').text();
    $tarefa.empty();
    $tarefa.append("<div class='tarefa-id'>" + id + "</div>")
          .append("<div class='tarefa-text'>" + text + "</div>")
          .append("<div class='tarefa-delete'></div>")
          .append("<div class='clear'></div>");

    updateTarefa(text, id);

    $(".tarefa-delete").click(onTarefaDeleteClick);

    $tarefa.click(onTarefaItemClick);
    }

    function loadTarefas(){
        // do something...
        $("#tarefa").empty();

    $.getJSON(server + "/tarefas", {usuario: login})
      .done(function(data) {
        for(var tarefa = 0; tarefa < data.length; tarefa++) {
          addTarefa(data[tarefa].texto, data[tarefa].id);
        }
      });
    }

    $('.tarefa-item').click(onTarefaItemClick);

    $('.tarefa-delete').click(onTarefaDeleteClick);

    $('#tarefa').keydown(onTarefaKeydown);

    loadTarefas();
}); 