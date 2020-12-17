@pushd %~dp0
@call ..\..\..\bat\compile.bat contract_main.js contract.min.js %*
@popd