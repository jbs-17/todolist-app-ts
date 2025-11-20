import * as z from "zod";

// karaktrer yang diizinkan
const AllowedUniqueChars = "!@#$%^&*()_+}{[]~`'?<>,.";
const isPasswordConfimMatch = ({password, passwordConfirm}) => passwordConfirm === password;
const isPasswordIncludeAllowedUniqueChars = ({password}) => {
      for(const c of AllowedUniqueChars){
      if(password.includes(c)) return true
    };
    return false
}

/**
* validasi transfer object data user yang registrasi dari req.body
*/
const RegisterDTO = z.object({
  email: z.email().required(),
  password: z.string().min(8).required(),
  passwordConfirm z.string().min(8).required() 
})
  .refine(isPasswordIncludeAllowedUniqueChars, { message : "password must have allowed unique char! !@#$%^&*()_+}{[]~`'?<>,.", path : ["password"] })
.refine(isPasswordConfimMatch, {message : "pasword confirmation doesnot match!" path : ["passwordConfirm"]})


/**
* validasi transfer object data user yang login dari req.body
*/
const LoginDTO = UserRegisterDTO;


const LoginToken = z.object({
  id: z.string()
});



/**
* validasi transfer object data user yang akan update email dari req.body
*/
const UpdateEmailDTO = z.object({
  email :  z.email().required(),
  newEmail :  z.email().required(),
  password : z.string().min(8).required()
});


/**
*
*/
const UpdatePasswordDTO = z.object({
  password : z.string().min(8).required() ,
  passwordConfirm : z.string().min(8).required()
}).refine(isPasswordConfimMatch,  {message : "pasword confirmation doesnot match!" path : ["passwordConfirm"]});

export type UserRegisterDTOType = z.infer<UserRegisterDTO>;
export type UserLoginDTO = UserRegisterDTOType;




const UserDTOs = {
  UserRegisterDTO,
  UserLoginDTO,
  UpdateEmailDTO,
  
}


export default UserDTOs;
