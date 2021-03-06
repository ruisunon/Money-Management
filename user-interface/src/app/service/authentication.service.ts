import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs/internal/Observable";
import {User} from "../domain/User";
import {ResetPassword} from "../domain/ResetPassword";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private tokenRequest = 'api/uaa/oauth/token';
    private currentAccount = 'api/accounts/current';
    private createUserUrl = "api/accounts/create";
    private resendVerificationEmailUrl = "api/uaa/users/verification/resend";
    private forgotPasswordUrl = "api/uaa/users/password/forgot";
    private changePasswordUrl = "api/uaa/users/change/password";

    constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {
    }

    public obtainAccessToken(user: User): Observable<Object> {
        let data = "scope=ui&grant_type=password&username=" + user.username + "&password=" + user.password;
        let options = {
            headers: new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'Basic YnJvd3Nlcjo='
            })
        };

        return this.http.post(this.tokenRequest, data, options);
    }

    public updatePassword(password: String): Observable<void> {
        let token = this.getOauthToken();

        let headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
        let options = {
            headers: headers
        };

        return this.http.post<void>(this.changePasswordUrl, password, options);
    }

    public resendVerificationEmail(email: String): Observable<String> {
        return this.http.get(this.resendVerificationEmailUrl + "?email=" + email, {responseType: 'text'});
    }

    public forgotPassword(email: string): Observable<String> {
        return this.http.get(this.forgotPasswordUrl + "?email=" + email, {responseType: 'text'});
    }


    public resetPassword(resetPassword: ResetPassword): Observable<String> {
        return this.http.put(this.forgotPasswordUrl, resetPassword, {responseType: 'text'});
    }

    public getCurrentAccount(): Observable<Account> {
        let token = this.getOauthToken();

        let headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
        let options = {
            headers: headers
        };

        return this.http.get<Account>(this.currentAccount, options);
    }

    public createUser(user: User): Observable<Object> {
        return this.http.post<Object>(this.createUserUrl, user);
    }

    public getOauthToken(): string {
        return this.cookieService.get('access_token');
    }

    public getUsername(): string {
        return this.cookieService.get("username");
    }

    public checkCredentials() {
        if (!this.cookieService.check('access_token')) {
            this.router.navigate(['']);
        }
    }

    public isUserLogin(): boolean {
        return this.cookieService.check('access_token');
    }

    public logout() {
        this.cookieService.delete('access_token');
        this.cookieService.delete('username');
        this.router.navigate(['']);
        localStorage.clear();
    }

    public saveCredentials(token, username, rememberMe: Boolean) {
        let expireDate;

        if (rememberMe) {
            expireDate = new Date(Date.now() + (1000 * token.expires_in));
        } else {
            expireDate = Date.now();
        }

        this.cookieService.set("access_token", token.access_token, expireDate);
        this.cookieService.set("username", username, expireDate);

        this.router.navigate(['/statistics']);
        window.location.reload();
    }

}
