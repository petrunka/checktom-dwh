define(
    [
        'jade!../templates/CreateArticleTemplate',
        'backbone',
        'backbone_validation'//,
        //'facebook'
    ],
    function (CreateArticleTemplate, Backbone) {
        var CreateArticleview = Backbone.Marionette.Layout.extend({
            template: function() {
                console.log('trying to render CreateArticleTemplate');
                var that = this;
                return _.template(CreateArticleTemplate());
            },
            initialize: function (options) {
                this.options = options || {}
            },
            onShow:function(){
                // on show is called when the view is created via the app.region.show(new view) call.
                var selDiv = $('#list');
                function handleFileSelect(e) {
                    var files = e.target.files;
                    var filesArr = Array.prototype.slice.call(files);
                    filesArr.forEach(function(f) {
                        if(!f.type.match("image.*")) {
                            return;
                        }
                        var reader = new FileReader();

                        reader.readAsDataURL(f); // async returns a
                        reader.onload = function (e) {
                            var html = "<img src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
                            selDiv.html(html);
                        }
                    });
                }
                document.getElementById('image').addEventListener('change', handleFileSelect, false);
            },
            events: {
                "submit #UploadForm": "sendForm"
            },
            sendForm:function(e){
                e.preventDefault();
                // create our formData
                var formData = new FormData($('#UploadForm')[0]);
                formData.append("priceNegotiable","false");
                var tags = $('[name=tagsinput]').val().split(',');
                if(tags === [""])
                {
                    tags = [null];
                }
                formData.append("hashTags",tags); // hashtag array[string]
                var negotiable = $('#NegotiableCheckbox').attr('checked');
                if (typeof negotiable !== typeof undefined && negotiable !== false) {
                    formData.append("priceNegotiable",true);
                }else{
                    formData.append("priceNegotiable",false);
                }
                var isFree = $('#FreeCheckbox').attr('checked');
                if (typeof isFree !== typeof undefined && isFree !== false) {
                    formData.price=0;
                    formData.append("price",0);
                }
                // formData.append("priceNegotiable",false); // checkbox
                // session from current user.
                var articleID = 'tempArticleId';
                var userID = 'tempUserId';
                $.ajax({
                    type: 'POST',
                    url: '/createArticle',
                    //url: '/upload/:articleID',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    headers: { 'articleID': articleID, 'userID': userID},
                    success: function (data) {
                        console.log("success");
                        console.log(data);
                    },
                    error: function (data) {
                        console.log("error");
                        console.log(data);
                    }
                });
            }

        });

        return CreateArticleview;
    });
