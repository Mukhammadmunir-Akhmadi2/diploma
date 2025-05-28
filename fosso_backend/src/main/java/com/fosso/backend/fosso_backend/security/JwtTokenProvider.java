package com.fosso.backend.fosso_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String secretKey;
    @Value("${app.jwt.expiration}")
    private long validityInMilliseconds;

    public String extractUserEmail(String jwt) {
        return extractClaim(jwt, Claims::getSubject);
    }

    public String generateJwtToken(UserDetails userDetails) {
        return generateJwtToken(userDetails, new HashMap<>());
    }
    public String generateJwtToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts
                .builder()
                .subject(userDetails.getUsername())
                .claims(extraClaims)
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSignInKey())
                .compact();

    }
    public boolean isTokenValid(String jwt, UserDetails userdetails) {
        String username = extractUserEmail(jwt);
        return (username.equals(userdetails.getUsername()) && !isTokenExpired(jwt));
    }

    public <T> T extractClaim(String jwt, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(jwt);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String jwt) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public Boolean isTokenExpired(String jwt) {
        return extractExpiration(jwt).before(new Date());
    }

    private Date extractExpiration(String jwt) {
        return extractClaim(jwt, Claims::getExpiration);
    }
}
