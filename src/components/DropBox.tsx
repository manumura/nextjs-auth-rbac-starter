import clsx from "clsx";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

function DropBox({ onDrop, imgSrc = null }) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    // open,
    isDragAccept,
    isFocused,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    onDrop,
    // noClick: true,
    // noKeyboard: true,
  });

  const baseClasses =
    "hero bg-base-100 border-dashed border-4 border-neutral rounded-box border-opacity-50";
  const getStyle = (props) => {
    const { isDragAccept, isFocused, isDragReject } = props;
    if (isDragAccept) {
      return clsx(baseClasses, "border-primary");
    }
    if (isDragReject) {
      return clsx(baseClasses, "border-accent");
    }
    if (isFocused) {
      return clsx(baseClasses, "border-secondary");
    }
    return clsx(baseClasses, "border-neutral");
  };
  const style = useMemo(
    () => getStyle({ isDragAccept, isFocused, isDragReject }),
    [isFocused, isDragAccept, isDragReject],
  );

  const files = acceptedFiles.map((file) => {
    const preview = URL.createObjectURL(file);
    const newFile = Object.assign(file, {
      preview,
    });
    return newFile;
  });

  const avatarImgSrc = files[0]?.preview || imgSrc;
  const avatar = avatarImgSrc ? (
    <div className="avatar">
      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <img src={avatarImgSrc} />
      </div>
    </div>
  ) : (
    <div className="avatar placeholder">
      <div className="w-24 rounded-full bg-base-200 text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-24">
        <span className="text-3xl" />
      </div>
    </div>
  );

  const fileInfos = files[0] ? (
    <p>
      {files[0].name} - {Math.round(files[0].size / 1024)} kb
    </p>
  ) : (
    <span />
  );

  return (
    <>
      {" "}
      <section>
        <div
          className={style}
          {...getRootProps({ isDragAccept, isFocused, isDragReject })}
        >
          <input {...getInputProps()} />
          <div className="hero-content flex-col lg:flex-row">
            {avatar}
            {/* <img src="/images/stock/photo-1635805737707-575885ab0820.jpg" className="max-w-sm rounded-lg shadow-2xl" /> */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Drag 'n' drop your image here
              </h1>
              <p className="mb-5">Or click to select a file</p>
              {/* <button type="button" className="btn btn-neutral" onClick={open}>
                Click to select file
              </button> */}
            </div>
          </div>
        </div>
      </section>
      <aside className="text-center">{fileInfos}</aside>
    </>
  );
}

export default DropBox;
