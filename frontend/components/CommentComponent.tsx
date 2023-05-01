import React from "react";

const CommentComponent = (props: any) => {
  const { comment } = props;
  return (
    <div className="flex flex-row">
      <img
        className="rounded-full w-14 h-14 p-1 m-1"
        src={comment.picture}
        alt="comment_u_img"
      />
      <div>
        <div className="p-1 font-semibold">{comment.username}</div>
        <div className="">{comment.comment} </div>
      </div>
    </div>
  );
};

export default CommentComponent;
