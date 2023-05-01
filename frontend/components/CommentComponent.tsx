import React from "react";

const CommentComponent = (props: any) => {
  const { comment } = props;
  return (
    <div className="container flex">
      <img
        className="rounded-full w-14 h-14 p-0.5 m-1 border border-black"
        src={comment.picture}
        alt="comment_u_img"
      />
      <div className="max">
        <div className="p-1 font-semibold whitespace-pre-wrap overflow-break-word break-words" >{comment.username}</div>
        <div className="p-1 break-all">{comment.comment} </div>
      </div>
    </div>
  );
};

export default CommentComponent;
