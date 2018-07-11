/*
<section class="content">
    <div class="box box-info">
        <div class="box-body">
            <div class="col-md-6 col-md-offset-3" id="drag-drop-uploader">
                <div class="upload-drop-zone">
                    <div class="drop-zone-message center-block">
                        点击或拖拽上传文件
                    </div>
                    <div class="drop-zone-info hide">
                        <div class="file-type center-block well well-sm">
                            <i class="fa fa-file-zip-o "></i>
                        </div>
                        <div class="file-path center-block"></div>
                    </div>
                </div>
                <form method="post" enctype="multipart/form-data" class="upload-form">
                    <input type="file" class="hide upload-files" name="files"/>

                    <div class="form-group col-md-12">
                        <div class="input-group input-group-md">
                            <input type="text" class="form-control file-path-input" readonly="readonly"/>
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-info btn-flat upload-btn">Upload file</button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
 */
(function ($) {
    var $base,$dropZone,$dropZoneMessage,$dropZoneInfo,$uploadForm,$uploadFiles,$filePathInput,$uploadBtn;

    var init = function (dom) {
        $base = $(dom);
        $dropZone = $base.find('.upload-drop-zone');
        $dropZoneMessage = $dropZone.find('.drop-zone-message');
        $dropZoneInfo = $dropZone.find('.drop-zone-info');
        $uploadForm = $base.find('.upload-form');
        $uploadFiles = $uploadForm.find('.upload-files');
        $filePathInput = $uploadForm.find('.file-path-input');
        $uploadBtn = $filePathInput.next().find('.upload-btn');

        $uploadFiles.on('change',function () {
            if (this.files.length < 1){
                $dropZoneMessage.removeClass('hide');
                $dropZoneInfo.addClass('hide');
            } else {
                var name = this.files[0].name;
                $dropZoneInfo.find('.file-path').html(name);
                $filePathInput.val(name);

                $dropZoneMessage.addClass('hide');
                $dropZoneInfo.removeClass('hide');
            }
        });

        $uploadBtn.on('click',function (e) {
            $uploadFiles.click();
            e.preventDefault()
        });

        $dropZone.on({
            click : function () {
                $uploadFiles.click();
            },
            drop : function (e) {
                e.preventDefault();
                //获取文件
                var files = e.originalEvent.dataTransfer.files;
                setFile(files[0]);
                this.className = 'upload-drop-zone';
            },
            dragover : function () {
                this.className = 'upload-drop-zone drop';
                return false;
            },
            dragleave : function () {
                this.className = 'upload-drop-zone';
                return false;
            }
        });
    }

    var setFile = function (file) {
        //文件设置
        $uploadFiles[0].files[0] = file;
        //显示设置
        $dropZoneInfo.find('.file-path').html(file.name);
        $dropZoneInfo.show();

        $filePathInput.val(file.name);
    }

    $.fn.uploader = function (dom) {
        init($('#' + dom));
    }
})(jQuery);