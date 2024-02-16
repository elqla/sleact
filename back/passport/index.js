const passport = require("passport");
const local = require("./local");
const User = require("../models/user");
const Workspace = require("../models/workspace");

module.exports = () => {
  // 쿠키에 id 만 저장하기
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // 매 요청마다, 디비에서 사용자 정보 가져옴
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ["id", "nickname", "email"],
        include: [
          {
            model: Workspace,
            as: "Workspaces",
          },
        ],
      });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
